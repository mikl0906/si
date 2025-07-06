import type { SiqPackage, Info, Round, Theme, Question, Step, StepParameter } from '../types/siq';
import { RoundType, QuestionTypes, StepTypes, StepParameterTypes } from '../types/siq';

export class SiqXmlParser {
  static parseXml(xmlContent: string): SiqPackage {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('XML parsing error: ' + parserError.textContent);
    }
    
    const packageElement = xmlDoc.querySelector('package');
    if (!packageElement) {
      throw new Error('No package element found in XML');
    }
    
    return this.parsePackage(packageElement);
  }
  
  private static parsePackage(packageElement: Element): SiqPackage {
    const infoElement = packageElement.querySelector('info');
    const roundsElement = packageElement.querySelector('rounds');
    
    return {
      name: packageElement.getAttribute('name') || '',
      version: packageElement.getAttribute('version') || '',
      id: packageElement.getAttribute('id') || '',
      restriction: packageElement.getAttribute('restriction') || '',
      publisher: packageElement.getAttribute('publisher') || '',
      contactUri: packageElement.getAttribute('contactUri') || '',
      difficulty: parseInt(packageElement.getAttribute('difficulty') || '0'),
      logo: packageElement.getAttribute('logo') || '',
      date: packageElement.getAttribute('date') || '',
      language: packageElement.getAttribute('language') || '',
      hasQualityControl: packageElement.getAttribute('hasQualityControl') === 'true',
      tags: this.parseTags(packageElement.querySelector('tags')),
      info: this.parseInfo(infoElement),
      rounds: this.parseRounds(roundsElement)
    };
  }

  private static parseTags(tagsElement: Element | null): string[] {
    if (!tagsElement) return [];
    
    const tagElements = tagsElement.querySelectorAll('tag');
    return Array.from(tagElements).map(tag => tag.textContent?.trim() || '');
  }
  
  private static parseInfo(infoElement: Element | null): Info {
    if (!infoElement) return { authors: [], sources: [], comment: '' };
    
    const authors = this.parseAuthors(infoElement.querySelector('authors'));
    const sources = this.parseSources(infoElement.querySelector('sources'));
    const commentElement = infoElement.querySelector('comment');
    const comment = commentElement?.textContent?.trim() || '';
    
    return { authors, sources, comment };
  }

  private static parseAuthors(authorsElement: Element | null): string[] {
    if (!authorsElement) return [];
    
    const authorElements = authorsElement.querySelectorAll('author');
    return Array.from(authorElements).map(author => author.textContent?.trim() || '');
  }

  private static parseSources(sourcesElement: Element | null): string[] {
    if (!sourcesElement) return [];
    
    const sourceElements = sourcesElement.querySelectorAll('source');
    return Array.from(sourceElements).map(source => source.textContent?.trim() || '');
  }
  
  private static parseRounds(roundsElement: Element | null): Round[] {
    if (!roundsElement) return [];
    
    const roundElements = roundsElement.querySelectorAll('round');
    return Array.from(roundElements).map(round => ({
      name: round.getAttribute('name') || '',
      type: this.parseRoundType(round.getAttribute('type')),
      info: this.parseInfo(round.querySelector('info')),
      themes: this.parseThemes(round.querySelector('themes'))
    }));
  }

  private static parseRoundType(typeStr: string | null): RoundType {
    switch (typeStr) {
      case 'standart': return RoundType.Standard;
      case 'table': return RoundType.Table;
      case 'final': return RoundType.Final;
      case 'themeList': return RoundType.ThemeList;
      default: return RoundType.Standard;
    }
  }
  
  private static parseThemes(themesElement: Element | null): Theme[] {
    if (!themesElement) return [];
    
    const themeElements = themesElement.querySelectorAll('theme');
    return Array.from(themeElements).map(theme => ({
      name: theme.getAttribute('name') || '',
      info: this.parseInfo(theme.querySelector('info')),
      questions: this.parseQuestions(theme.querySelector('questions'))
    }));
  }
  
  private static parseQuestions(questionsElement: Element | null): Question[] {
    if (!questionsElement) return [];
    
    const questionElements = questionsElement.querySelectorAll('question');
    return Array.from(questionElements).map(question => ({
      price: parseInt(question.getAttribute('price') || '0'),
      typeName: this.parseQuestionType(question.getAttribute('type')),
      info: this.parseInfo(question.querySelector('info')),
      script: this.parseScript(question.querySelector('script')),
      right: this.parseAnswers(question.querySelector('right')),
      wrong: this.parseAnswers(question.querySelector('wrong')),
      parameters: this.parseStepParameters(question)
    }));
  }

  private static parseQuestionType(typeStr: string | null): QuestionTypes {
    switch (typeStr) {
      case 'simple': return QuestionTypes.Simple;
      case 'withButton': return QuestionTypes.WithButton;
      case 'auction': return QuestionTypes.Auction;
      case 'state': return QuestionTypes.Stake;
      case 'stakeAll': return QuestionTypes.StakeAll;
      case 'cat': return QuestionTypes.Cat;
      case 'secret': return QuestionTypes.Secret;
      case 'secretPublicPrice': return QuestionTypes.SecretPublicPrice;
      case 'secretNoQuestion': return QuestionTypes.SecretNoQuestion;
      case 'noRisk': return QuestionTypes.NoRisk;
      case 'forYourself': return QuestionTypes.ForYourself;
      case 'forAll': return QuestionTypes.ForAll;
      default: return QuestionTypes.Default;
    }
  }

  private static parseScript(scriptElement: Element | null): Step[] {
    if (!scriptElement) return [];
    
    const stepElements = scriptElement.querySelectorAll('step');
    return Array.from(stepElements).map(step => ({
      type: this.parseStepType(step.getAttribute('type')),
      parameters: this.parseStepParameters(step)
    }));
  }

  private static parseStepType(typeStr: string | null): StepTypes {
    switch (typeStr) {
      case 'setAnswerType': return StepTypes.SetAnswerType;
      case 'showContent': return StepTypes.ShowContent;
      case 'askAnswer': return StepTypes.AskAnswer;
      case 'setAnswerer': return StepTypes.SetAnswerer;
      case 'announcePrice': return StepTypes.AnnouncePrice;
      case 'setPrice': return StepTypes.SetPrice;
      case 'setTheme': return StepTypes.SetTheme;
      case 'accept': return StepTypes.Accept;
      default: return StepTypes.ShowContent;
    }
  }

  private static parseStepParameters(stepElement: Element): Record<string, StepParameter> {
    const parameters: Record<string, StepParameter> = {};
    
    const paramElements = stepElement.querySelectorAll('param');
    paramElements.forEach(param => {
      const name = param.getAttribute('name');
      const type = param.getAttribute('type');
      
      if (name) {
        parameters[name] = {
          type: this.parseStepParameterType(type)
        };
      }
    });
    
    return parameters;
  }

  private static parseStepParameterType(typeStr: string | null): StepParameterTypes {
    switch (typeStr) {
      case 'simple': return StepParameterTypes.Simple;
      case 'content': return StepParameterTypes.Content;
      case 'group': return StepParameterTypes.Group;
      case 'numberSet': return StepParameterTypes.NumberSet;
      default: return StepParameterTypes.Simple;
    }
  }

  private static parseAnswers(answersElement: Element | null): string[] {
    if (!answersElement) return [];
    
    const answerElements = answersElement.querySelectorAll('answer');
    return Array.from(answerElements).map(answer => answer.textContent?.trim() || '');
  }
}
